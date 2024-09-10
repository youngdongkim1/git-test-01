import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams } from 'react-router-dom';

function MenuItemList(props){
    const {title,dataList,onMenuClick} = props

    return <>
    <h2>{title}</h2>
    <ul style={{listStyle:"none"}}>
        {dataList.map((dt,index)=>{
            return <li key={index}><a href="#" onClick={(e)=>{
                e.preventDefault();
                onMenuClick(dt.no);
            }}>{dt.name}</a> / {dt.price} </li>
        })}
    </ul>
    </>
}
//주문현황
function OrderStatusPage(props){
    const {jumunList} = props
    const [tableNo, setTableNo] = useState(1)

    return <>
        <h1>주문현황 : 테이블번호 : {tableNo}</h1>

    </>
}




function MenuOrderPage(props) {
    const [siksaList, setSiksaList] = useState([])//식사류
    const [gansikList, setGansikList] = useState([])//간식류
    const [jumunList, setJumunList] = useState([])//주문현황목록
    // const [ tableNo, setTable ] = useState(3) //테이블번호 임시
    const [ seq, setSeq ] = useState(0) //화면갱신용변수

    const {tableNo} = useParams() //테이블번호를 경로를 통해 전달


    //초기화코드
    useEffect(()=>{
        fetchList()
    },[])

    function fetchList(){
        // let url = 'http://localhost:8080/menus'
        let url = '/menus'
        fetch( url )
        .then((response) => response.json())
        .then((json) => {
            console.log("fetchList : ",json)
            //간식류와 식사류로 분리
            //true를 반환하는것만 따로 배열생성 반환
            let gansikArr = json.data.filter( (dt)=> dt.gubun=="간식" )
            let siksaArr = json.data.filter( (dt)=> dt.gubun=="식사" )
            setGansikList(gansikArr)
            setSiksaList(siksaArr)
        });
    }

    //식사류,간식류 선택시 주문현황으로 데이터 전달
    function siksaJumun(menuno){
        for(let ss of siksaList){
            if(ss.no == menuno){
                //수신서버에서 메뉴번호를 menuNo로 수신
                ss.menuNo = ss.no
                //주문갯수변수 추가(amount)
                if(ss.amount){
                    ss.amount += 1
                    setSeq(prev=>prev+1)
                }
                else{
                    ss.amount = 1
                    setJumunList( [...jumunList, ss] )
                }
                break;
            }
        }
    }
    function gansikJumun(menuno){
        for(let ss of gansikList){
            if(ss.no == menuno){
                //수신서버에서 메뉴번호를 menuNo로 수신
                ss.menuNo = ss.no 
                //주문갯수변수 추가(amount)
                if(ss.amount){
                    ss.amount += 1
                    setSeq(prev=>prev+1)
                }
                else{
                    ss.amount = 1
                    setJumunList( [...jumunList, ss] )
                }
                break;
            }
        }
    }

    return (
        <>
    <Container>
        <h1>주문화면</h1>
      <Row>
        <Col xs={3}>
        <h2>식사류</h2>
        <ul style={{listStyle:"none"}}>
            {siksaList.map((dt,index)=>{
                return <li key={index}><a href="#" onClick={(e)=>{
                    e.preventDefault();
                    siksaJumun(dt.no) //식사주문
                }}>{dt.name}</a> / {dt.price}</li>
            })}
        </ul>
        </Col>
        <Col xs={3}>간식류<MenuItemList 
                            title="간식류" 
                            dataList={gansikList}
                            onMenuClick={gansikJumun}/></Col>
        <Col xs={6}>주문현황:{jumunList.length}
            <h2>주문현황 : 테이블 번호 : {tableNo}번</h2>
            <ul style={{listStyle:"none"}}>
                { jumunList.map((jm,index)=>{
                    return <li key={index}>
                        <button onClick={()=>{ //주문삭제
                            const idx = jumunList.findIndex(function(item) {return item.no === jm.no}) //
                            if (idx > -1) {
                                //삭제하기전에 amount변수를 삭제해야 다시 추가 가능함
                                delete jumunList[idx].amount
                                jumunList.splice(idx, 1)
                            }
                            setSeq(prev => prev+1)
                        }}>X</button>
                        {jm.name} {jm.price} 
                        <button onClick={(e)=>{
                            jm.amount += 1;
                            setSeq(prev => prev+1)
                        }} >증가</button>
                        <button onClick={(e)=>{
                            //갯수가 0인데 감소시킨경우
                            if(jm.amount==0) return;
                            jm.amount -= 1;
                            setSeq(prev => prev+1)
                        }} >감소</button>
                        {jm.amount}  {jm.amount*jm.price}
                    </li>
                })}
            </ul>
            <h3>총가지수 : {jumunList.length}</h3>
            <h3>총갯수 : {jumunList.reduce((acc, cur) => {
                            return acc + cur.amount;
                            }, 0)}</h3>
            <h3>총금액 : {jumunList.reduce((acc, cur) => {
                            return acc + (cur.price*cur.amount);
                            }, 0)}</h3>
            <div>
                <button onClick={(e)=>{
                    // 서버의 OrderForm 의 구조와 동일일
                    let orderData = {
                        tableNo: tableNo,
                        detailList: jumunList
                    }
                    console.log( JSON.stringify(orderData) )
                    fetch( "/orders" , {
                        method: 'POST', //새로운값 추가시 POST
                        body: JSON.stringify(orderData),//추가할객체
                        headers: {
                          'Content-type': 'application/json; charset=UTF-8',
                        },
                      })
                    .then((response) => response.json())
                    .then((json) => {
                        alert("등록완료")
                        console.log(json)
                    });
            
                }}>주문확정</button>
                <button>취소</button>
            </div>
        </Col>
      </Row>
    </Container>

        </>
    );
}

export default MenuOrderPage;