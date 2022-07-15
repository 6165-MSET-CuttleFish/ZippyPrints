import { getAuth, signOut } from "firebase/auth";
import { Navigate } from 'react-router-dom';

export default function loggingOut() {

const auth = getAuth();
signOut(auth).then(() => {
}).catch((error) => {
  window.alert(error)
});
return (
  <div>
      <Navigate to="/Home" />
  </div>
);
}
