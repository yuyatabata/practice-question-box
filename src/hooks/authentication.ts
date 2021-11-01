import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { getFirestore, collection, doc, getDoc, setDoc } from '@firebase/firestore'
import { User } from '../models/User'
import { atom, useRecoilState } from 'recoil'
import { useEffect } from 'react'

const userState = atom<User>({
  key:'user',
  default: null,
})


export const useAuthentication = () => {
  const [user, setUser] = useRecoilState(userState)

  const createUserIfNotFound = async (user:User) =>{
    const db = getFirestore()
    const usersCollection = collection(db, 'users')
    const userRef = doc(usersCollection, user.uid)
    const document = await getDoc(userRef)
    if (document.exists()) {
      // NOTE：無駄な書き込みを防ぐ
      return
    }

    await setDoc(userRef, {
      name: 'taro' + new Date().getTime(), 
    })
  }
  

  useEffect(() => {
    if (user !== null) return;

    const auth = getAuth()

    console.log('Start useEffect')

    signInAnonymously(auth).catch(error => {
      const errorCode = error.code
      const errorMessage = error.message
      console.log(errorMessage)
    })
  
    onAuthStateChanged(auth, firebaseUser => {
      if (firebaseUser) {
        const loginUser: User = {
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
          name: '',
        }

        setUser(loginUser)

        // createUserIfNotFound(loginUser)
      } else {
        setUser(null)
      }
    })
  }, [])

  return { user }
}


if (process.browser) {
}