import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  let navigate = useNavigate();
  const auth = getAuth();
  signOut(auth).then(() => {
    navigate('../', { replace: true })
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
  return (
    <div>Logging out...</div>
  );
}
