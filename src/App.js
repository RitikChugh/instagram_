import React, { useState,useEffect } from 'react';
import './App.css';
import Post from './post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import Modal  from '@material-ui/core/Modal';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes= useStyles();
  const [modalStyle]=useState(getModalStyle);

  const[posts,setPosts]=useState([]);
  const[open,setOpen] =useState(false);
  const[openSignIn,setOpenSignIn]=useState(false);
  const[username,setUsername] =useState('');
  const[password,setPassword] =useState('');
  const[email,setEmail] =useState('');
  const[user,setUser]= useState(null);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser) {
        /////
        console.log(authUser);
        setUser(authUser);

      } else {
        //////
        setUser(null);
      }

    })

    return() => {
      unsubscribe();
    }

  },[user,username]);

  useEffect(() =>{
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc =>({
        id:doc.id, post:doc.data()
      })));
    })

  },[]);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser)=> {
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error) =>alert(error.message))

    setOpen(false);
  }

  const signIn=(event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error)=> alert(error.message))

  setOpenSignIn(false);
  }

  return (
    <div className="app">



      <Modal
        open={open}
        onClose={()=> setOpen(false)}
        >
        <div style={modalStyle} className={classes.paper}>
      <form className= "app_signup">
        <center>
         <img 
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png "
          alt=""

        />
        </center>

        <Input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />

        <Input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        
        
        <Input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" onClick={signUp}>sign Up</Button>
         

      </form>

      
        </div>
    </Modal>

    <Modal
        open={openSignIn}
        onClose={()=> setOpenSignIn(false)}
        >
        <div style={modalStyle} className={classes.paper}>
      <form className= "app_signup">
        <center>
         <img 
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png "
          alt=""

        />
        </center>


        <Input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        
        
        <Input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" onClick={signIn}>sign In</Button>
         

      </form>

      
        </div>
    </Modal>
     
     <div className="app_header">
        <img 
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png "
          alt=""

        />
          {user ? (
          <Button onClick={() => auth.signOut()}> logout</Button>
        
        ):(
          <div className="app_logincontainer"> 
            <Button onClick={() => setOpenSignIn (true)}>sign In</Button>
            <Button onClick={() => setOpen (true)}>sign Up</Button>
          </div>
          
          )}
        </div>


      <div className="app_posts">
        <div className="app_postsleft">

        {

          posts.map(({id,post}) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption}imageUrl={post.imageUrl}/>
          )) //this is independent upload code means only one post load at a time 1:20 cleaver.
        }

        </div>

        <div className="app_postsRight">

        <InstagramEmbed
        url='https://www.instagram.com/p/BiKli3SD0vH/'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={()=> {}}
        onSuccess={()=> {}}
        onAfterRender={()=> {}}
        onFailure={()=> {}}
      /> 

        </div>


 
      </div>


      
   

        {user?.displayName? (
          <ImageUpload username={user.displayName}/>


      ): (
        <h2>sorry you need to login to upload</h2>
      )}

      </div>
    );
  }
      
  export default App;
