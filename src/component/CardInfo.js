import React,{useState,useEffect} from 'react';
import { Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
//css
import style from '../style/CardInfoStyle';

function CardInfo(props){

    const [text, setText] = useState([]) 
    
    // useEffect(()=>{
    //     let cardtext = props.text.filter(item=>item.url === props.image)
    //     if(cardtext.length > 0)
    //         Settext(cardtext[0].text)
    // },[props.text,props.image])
    useEffect(() => {
        let url = props.image;
        let cardText = (props.userDeck).find(item => item.url === url);
        //console.log(cardText);
        if(cardText !== undefined)
            setText(cardText.text);
    }, [props.image]);

    return(
        // <div className="col-lg-3 col-md-2 col-sm-12" style={{float:"left"}}>
        //     {/* card image */}
        //     <div className="card" style={{width:"16rem"}}>
        //         <img src={props.image} className="card-img-top" alt="..."/>
        //     </div>
        //     {/* card text */}
        //     <div className="mt-3" style={style.cardtext} >
        //         {
        //             text.map((item,i)=><p key={i} style={{padding:'10px'}}>{item}</p>)
        //         }
        //     </div>
        //     <Link to="/">
        //         <button onClick={props.handleExitGame} style={{width:'16rem', marginTop:'16%'}}>ออกจากเกม</button>
        //     </Link>
        // </div>
        <Col sm={12} md={2} lg={3}>
             {/* card image */}
            <Card style={{ width:'16rem' }}>
                <Card.Img variant="top" src={props.image} />
            </Card>
            {/* card text */}
            <div className="mt-3" style={style.cardtext} >
                {text.map((item,i)=><p key={i} style={{padding:'10px'}}>{item}</p>)}
            </div>
            {/* exit game */}
            <Link to="/">
                <Button variant="danger" onClick={props.handleExitGame} style={{width:'16rem', marginTop:'16%'}}>ออกจากเกม</Button>
            </Link>
        </Col>
    )
}

export default CardInfo