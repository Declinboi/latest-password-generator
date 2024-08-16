 const empty = "";
 const uCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
 const lCase = "abcdefghijklmnopqrstuvwxyz";
 const number = "0123456789";
 const symbol = "!@#$%^&*()_+|?><~";

 const pLength = document.getElementById("p-length");
 const upperCase = document.getElementById("p-uppercase");
 const lowerCase = document.getElementById("p-lowercase");
 const pNumber = document.getElementById("p-number");
 const pSymbol = document.getElementById("p-symbol");
 const submit = document.getElementById("submit");
 const password = document.getElementById("password");
 const copy = document.getElementById("copy");

 submit.addEventListener("click", () => {
   let initialPassword = empty;
   upperCase.checked ? (initialPassword += uCase) : "";
   lowerCase.checked ? (initialPassword += lCase) : "";
   pNumber.checked ? (initialPassword += number) : "";
   pSymbol.checked ? (initialPassword += symbol) : "";
   const value = generatePassword(pLength.value, initialPassword);
   password.value = value;

   // Open the IndexedDB database
   let db;
   const request = indexedDB.open("passwords", 1);

   request.onerror = (event) => {
     console.error("Error opening database", event);
   };

   request.onupgradeneeded = (event) => {
     db = event.target.result;
     db.createObjectStore("passwords", { keyPath: "title" });
   };

   request.onsuccess = (event) => {
     db = event.target.result;

     // Add the generated password to the IndexedDB database
     const title = prompt("Enter a title for your password:");
     const transaction = db.transaction("passwords", "readwrite");
     const store = transaction.objectStore("passwords");
     const request = store.add({ title, password: value });

     request.onerror = (event) => {
       console.error("Error adding password", event);
     };

     request.onsuccess = (event) => {
       console.log("Password added successfully");
     };
   };
 });

 function generatePassword(l, initialPassword) {
   let pass = "";
   for (let i = 0; i < l; i++) {
     pass += initialPassword.charAt(
       Math.floor(Math.random() * initialPassword.length)
     );
   }
   return pass;
 }

 copy.addEventListener("click", () => {
   if (password.value == "") {
     alert("Please generate a password first");
   } else {
     password.select();
     document.execCommand("copy");
     alert("Password copied to clipboard");
   }
 });