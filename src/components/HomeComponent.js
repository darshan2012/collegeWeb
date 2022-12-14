import React from 'react';
import CreateCollege from './CreateCollege';
import '../CSS/home.css';
import Search from './Search';
import Footer from './Footer';


function HomeComponent({isAdmin, User,setUser}) {
    let isUser = User && User != undefined && User!= null && User!=""?true:false
    return (
        <>
        <div className='cta'>
        <div className='content container row back ms-5'>

            
            <div className='col-8  mx-auto  text-center'>
                
            <h1 className='mt-5 title '> 
            "Follow , Create , Communicate , Apprise"
            </h1>    
            <h4 className='text-center mb-4 fs-5'>
                get any update regarding your college. search your college and follow them to stay upto date
                
                <div className='my-3 mt-4'><CreateCollege isUser={isUser} setUser={setUser} /></div>
                or
            </h4>  
            <Search ishome={true} />
            </div> 
            
        </div>
        <Footer />
        </div>
       

        </>
        
    );
}

export default HomeComponent;