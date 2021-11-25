import * as admin from 'firebase-admin'

console.log('admin.apps',admin.apps)
if (admin.apps.length === 0) {
  // const credential = JSON.parse(
  //   Buffer.from(
  //     process.env.GCP_CREDENTIAL.replace(/\\n/g, '\n'),
  //     'base64'
  //   ).toString()
  // )

  admin.initializeApp({
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    credential: admin.credential.cert({
      projectId: process.env.FSA_PROJECT_ID,
      privateKey: process.env.FSA_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FSA_CLIENT_EMAIL,
    })
  })
}