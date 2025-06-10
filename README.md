Important note: If web page doesn’t load, refresh page after Login.

-- Admin Credentials (Both are Login with Google)

1- Restaurant Login:

   noumantarrar6@gmail.com 
   Nexusreaper456

2- User Login:

   noumantarrar918@gmail.com
   Nexusreaper456

--Documentation

   Project Structure
   /src: React components, pages, and routes
   /public: Static assets and the Firebase HTML-verification file
   vite.config.js: Vite build configuration
   firebase.json: Firebase Hosting configuration
   .github/workflows/main.yml: GitHub Actions for CI/CD

-- How CRUD Works

1- Create (Add)
   Users (Admins) add new menu items via a form.
   Orders are created when a customer places an order from the cart.
   Implementation: addDoc(collection(db, 'menuItems'), {...data}) and addDoc(collection(db, 'orders'), {...orderData}).

2- Read (View)
   Menu items and orders are fetched on page load.
   Implementation: onSnapshot(query(collection(db, 'menuItems')), callback) for real-time updates.

3- Update (Edit) 
   Admins can edit menu items (e.g., name, price, image URL).
   Implementation: updateDoc(doc(db, 'menuItems', itemId), { price: newPrice }).

4- Delete
   Admins can delete a menu item from the collection.
   Customers can cancel their pending orders.
   Implementation: deleteDoc(doc(db, 'menuItems', itemId)).

-- Role Management

The application supports two primary roles:

1- Restaurant Admin
   Access: Can manage (add/edit/delete) menu items and view all orders.
   Implementation: After user authentication, the Firebase function checks the users collection for role: 'admin'. Admin routes are protected by checking currentUserRole === 'admin'.

2- Customer
   Access: Can browse menu, place orders, and view their own order status.
   Implementation: Default role is customer. Protected routes ensure customers can only view/edit their own orders.

-- Deployment Link

food-ordering-website-a7a08.web.app  (Dangerous Site Warning)

food-ordering-website-a7a08.firebaseapp.com
