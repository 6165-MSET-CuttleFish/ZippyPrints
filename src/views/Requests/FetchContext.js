import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Auth/Auth';
import { getDocs, query, collection, getFirestore, doc, getDoc } from 'firebase/firestore';
// Create a context
export const FetchContext = createContext();

export const FetchProvider = ({ children }) => {
    const [req, setReq] = useState([]);
    const [filter, setFilter] = useState('All'); // Filter state
    const db = getFirestore();
    const q = query(collection(db, "requests"));
    const [printReq, setPrintReq] = useState([])
    const [laserReq, setLaserReq] = useState([])
    const [CNCReq, setCNCReq] = useState([])
    const {currentUser} = useContext(AuthContext);

    const [ ref, setRef ] = useState();
    const sharedRef = doc(db, 'shared', `${currentUser?.uid}`)
    const userRef = doc(db, 'users', `${currentUser?.uid}`)
    const printerRef = doc(db, "printers", `${currentUser?.uid}`)   
    const [ error, setError ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState("")

    // Filter variables
    const [ allSelect, setAllSelect] = useState(true)
    const [ printSelect, setPrintSelect] = useState(false)
    const [ laserSelect, setLaserSelect] = useState(false)
    const [ CNCSelect, setCNCSelect] = useState(false)
    
    //distance api
    const [ userLocation, setUserLocation ] = useState()
    const [ distance, setDistance ] = useState()

    // Function to calculate distance (once)
    const calculateDistance = (destination, callback) => {
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix({
          origins: [userLocation],
          destinations: [destination],
          unitSystem: window.google.maps.UnitSystem.IMPERIAL,
          travelMode: 'DRIVING',
      }, callback);
    };

    // Function to determine account type of user
    useEffect(() => {
      const getRef = async () => {
        try {
          setError(true)
          const docSnap = await getDoc(sharedRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data?.printer) {
              setRef(printerRef);
            } else {
              setRef(userRef);
            }
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.log(error)
          setError(true)
        }
      };
  
      if (sharedRef) {
        getRef();
      }
    }, []);

    // Function to calculate user location
    useEffect(() => {
      //get current user's general location
      const getLocation = async() => {
          try {
              const docSnap = await getDoc(ref)
              if (docSnap.exists()) {
                  const data = docSnap.data();   
                  setUserLocation(data.formattedAddress)
              }
          } catch (error) {
              console.log(error)
          }
      }
      if (ref) {
          getLocation()
      }
    }, [ref])

    console.log(localStorage)
    // Function to fetch and set requests
    const getRequests = async () => {
      try {
        const storedRequests = localStorage.getItem('sortedRequests');
        const lastUpdated = localStorage.getItem('lastUpdated');
        const now = new Date();

        if (storedRequests && lastUpdated && (now - new Date(lastUpdated)) < 24 * 60 * 60 * 1000) {
            console.log("Fetching req from local storage")
            console.log(localStorage.getItem('sortedRequests'))
          const parsedRequests = JSON.parse(storedRequests);
          console.log(parsedRequests)
          setReq(parsedRequests);
        } else {
            console.log("Fetching req from API")
          const querySnapshot = await getDocs(q);
            setReq([]);
            setPrintReq([]);
            setLaserReq([]);
            setCNCReq([]);
      
            const promises = querySnapshot.docs.map(async (doc) => {
              if (userLocation && doc.data()?.location) {
                return new Promise((resolve) => {
                  calculateDistance(doc.data()?.location, (response, status) => {
                    // console.log("fetch api")
                    if (status === 'OK') {
                      const distance = response.rows[0].elements[0].distance.text; // Distance in miles
                      const distanceValue = response.rows[0].elements[0].distance.value
      
                      const requestData = {
                        ...doc.data(),
                        distance: distance,
                        distance_value: distanceValue
                      };
      
                      // Updating arrays directly inside the callback
                      setReq((current) => [...current, requestData]);
                    
                      if (doc.data()?.type === "3D Printing") {
                        console.log("3dprinting")
                        setPrintReq((current) => [...current, requestData]);
                      } else if (doc.data()?.type === "Laser Cutting") {
                        console.log("lasercutting")
                        setLaserReq((current) => [...current, requestData]);
                      } else if (doc.data()?.type === "CNCing") {
                        setCNCReq((current) => [...current, requestData]);
                      }
                      console.log(req)
      
                      resolve(); // Resolve the promise once the state has been updated
                    } else {
                      resolve(); // Resolve even if the status is not OK
                    }
                  });
                });
              }
              console.log(req)
            });

            await Promise.all(promises).then(() => {
                setReq((current) => 
                [...current].sort((a, b) => a.distance_value - b.distance_value)
              )

              setPrintReq((current) => 
                [...current].sort((a, b) => a.distance_value - b.distance_value)
              );

              setLaserReq((current) => 
                [...current].sort((a, b) => a.distance_value - b.distance_value)
              );

              setCNCReq((current) => 
                [...current].sort((a, b) => a.distance_value - b.distance_value)
              );
            })
            

        }
      } catch (error) {
        console.log(error);
      }
    };

    // Refresh function
    const refreshRequests = () => {
        localStorage.removeItem('sortedRequests');
        // localStorage.removeItem('printReq');
        // localStorage.removeItem('laserReq');
        // localStorage.removeItem('CNCReq');
        localStorage.removeItem('lastUpdated');
        getRequests();
    };

    //Update local storage whenever req changes
    const updateStorage = () => {
        const now = new Date()
        localStorage.setItem('sortedRequests', JSON.stringify(req))
        // localStorage.setItem('printReq', JSON.stringify(printReq))
        // localStorage.setItem('laserReq', JSON.stringify(laserReq))
        // localStorage.setItem('CNCReq', JSON.stringify(CNCReq))
        localStorage.setItem('lastUpdated', now)
    }

    // Effect to fetch requests on initial load
    useEffect(() => {
        getRequests();
    }, [userLocation]);

    
    useEffect(() => {
        updateStorage();
    }, [req])
    

    // Filtered requests based on the filter state
    const filteredRequests = req.filter((request) => {
        if (filter === 'All') return true;
        if (filter === '3D Prints') return request.type === '3D Print';
        if (filter === 'Laser Cut') return request.type === 'Laser Cut';
        if (filter === 'CNC') return request.type === 'CNC';
        return true;
    });

    const handleFilter = (filterType) => {
        setFilter(filterType)
        if (filterType == "All") {
          // setReq([...printReq, ...laserReq, ...CNCReq])
          setPrintSelect(false)
          setAllSelect(true)
          setLaserSelect(false)
          setCNCSelect(false)
        } else if (filterType == "3D Prints") {
          // setReq(printReq)
          setPrintSelect(true)
          setAllSelect(false)
          setLaserSelect(false)
          setCNCSelect(false)
        } else if (filterType == "Laser Cut") {
          // setReq(laserReq)
          setPrintSelect(false)
          setAllSelect(false)
          setLaserSelect(true)
          setCNCSelect(false)
        } else if (filterType == "CNC") {
          // setReq(CNCReq)
          setPrintSelect(false)
          setAllSelect(false)
          setLaserSelect(false)
          setCNCSelect(true)
        }
      }
        

    return (
        <FetchContext.Provider value={{ req: filteredRequests, refreshRequests, setFilter, handleFilter, allSelect, printSelect, laserSelect}}>
            {children}
        </FetchContext.Provider>

    );
};