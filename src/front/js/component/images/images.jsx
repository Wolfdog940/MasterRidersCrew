import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { Navbar } from "../navbar";
import "../../../styles/image.css";


const Images = ()=>{
    const { store, actions } = useContext(Context);
    const [nextPage, setNextPage] = useState(1);

    useEffect(()=>{
        actions.getImages(nextPage);
        let button = document.querySelector("#prevButton");
        button.disabled = true;
    },[])

    useEffect(()=>{
        if (nextPage === 1){
            let button = document.querySelector("#prevButton");
            button.disabled=true;
        }
    },[nextPage])

    const prevImages = ()=>{
        if (nextPage - 1 > 0){
            actions.getImages(nextPage-1);
            setNextPage(page=>page-1);
            button.disabled = false;
        }
        else return
    }

    const nextImages = async ()=>{
        let morePics = await actions.getImages(nextPage+1);
        if (morePics){
            setNextPage(page=>page+1);
            let button = document.querySelector("#prevButton");
            button.disabled=false;
        }
    }

    return(
        <div>
            <Navbar/>
            <h1 className="text-center text-white">Tus Imagenes</h1>
            <div className="imageContainer">
                {store.userImages.map((image, index)=>{
                    return (
                        <div key={index} className="myCardImage overflow-hidden">
                            <img className="myImage" src={image.image} onClick={()=>{
                                actions.updateProfile({ profile_picture: image.id });
                                actions.getProfile();
                                }}/>
                        </div>
                    )
                })}        
            </div>
            <div className="d-flex justify-content-center my-2">
                <button className="btn btn-primary me-2" id="prevButton" onClick={prevImages}>Pagina Anterior</button>
                <button className="btn btn-primary" id="nextButton" onClick={nextImages}>Pagina Siguiente</button>
            </div>
        </div>
    )
}

export default Images;