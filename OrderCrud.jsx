import React from 'react';

function OrderCrud(props) { 

    function handleSubmit(e){
        e.preventDefault();

        const data = {}
        data.tableNo=1
        data.detailList = [
            {menuNo:1,amount:1},
            {menuNo:2,amount:2},
        ]
        console.log(data);

        let url = 'http://localhost:8080/orders'
        fetch( url , {
            method: 'POST', //새로운값 추가시 POST
            body: JSON.stringify(data),//추가할객체
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          })
        .then((response) => response.json())
        .then((json) => {
            alert("주문등록완료")
            console.log(json)
            // navigate("/admin/list")
        });
    }

    return (
        <div>
            <h1>주문등록</h1>
            <button onClick={handleSubmit}>등록</button>
        </div>
    );
}

export default OrderCrud;