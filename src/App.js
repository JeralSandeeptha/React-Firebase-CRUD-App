import { useEffect, useState } from 'react';
import './App.css';
import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

function App() {

  const [users, setUsers] = useState([]);

  const [newname, setName] = useState("");
  const [newage, setAge] = useState(0);

  const usersCollectionRef = collection(db, "users")

  useEffect( () => {
    getUsers();
  }, []);

  const createUser = async () => {
    await addDoc(usersCollectionRef, {name: newname, age: Number(newage)});
    getUsers();
  }

  const getUsers = async () => {
    const data = await getDocs(usersCollectionRef);
    setUsers(data.docs.map( (doc) => ({...doc.data(), id: doc.id})));
    console.log(users);
  }

  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const newFields = {age: age + 1};
    await updateDoc(userDoc, newFields);
    getUsers();
  }

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    getUsers();
  }

  return (
    <div className="App">

      <input placeholder='enter your name' type='text' onChange={ (event) => setName(event.target.value)}/>
      <input placeholder='enter your age' type='number' onChange={ (event) => setAge(event.target.value)}/>

      <button onClick={createUser}>Create User</button>

      {
        users.map( (user) => {
          return(
            <div>
              <h5>{user.id}</h5>
              <h1>{user.name}</h1>
              <h4>{user.age}</h4>
              <button onClick={ () => updateUser(user.id, user.age) }>Increase Age</button>
              <button onClick={ () => deleteUser(user.id) }>Delete User</button>
            </div>
          )
        })
      }
    </div>
  );
}

export default App;
