import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  addDoc,
  doc,
  writeBatch,
} from "firebase/firestore/lite";
import { readFileSync } from "fs";
import readlineSync from "readline-sync";

import firebaseConfig from "./firebaseConfig.js";

// reading json data
const myData = JSON.parse(readFileSync("./data/privateData.json"));

console.log(`Post this dataset to your Firebase Cloud Firestore: \n`);
console.log(`${JSON.stringify(myData, null, 2)}`);

const answer = readlineSync.question("\nproceed? (y/n) : ");

console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");

if (answer == "y" || answer == "Y") {
  // setting fireabase app
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const colName = "users"; // your collection name

  /**
   * read all docs from db
   * @param {*} db
   * @returns
   */
  async function getUsers(db) {
    const col = collection(db, colName);
    const snapshot = await getDocs(col);
    const list = snapshot.docs.map((doc) => doc.data());
    return list;
  }

  if (Array.isArray(myData)) {
    const batch = writeBatch(db);
    /** Write all data using batch */
    await (async () => {
      myData.forEach((data) => {
        batch.set(doc(collection(db, colName)), data);
      });
      await batch.commit();
    })();
  } else {
    await addDoc(collection(db, colName), myData);
  }

  console.log(await getUsers(db));

  console.log(
    "Please check your Firebase Console. https://console.firebase.google.com/"
  );
} else {
  console.log("OK, bye...");
  process.exit(0);
}
