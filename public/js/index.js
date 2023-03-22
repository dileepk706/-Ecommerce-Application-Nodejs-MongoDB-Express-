const email=document.querySelector('#typeEmail');
const password=document.querySelector('#password')
const popupMessage = document.querySelector('.popup-message');
const btn=document.querySelector('#btn');



const addCatbtn=()=>{
    fetch('http://localhost:3000/login',{
        method:'POST',
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify({
            email:email.value,
            password:password.value
        })
    }).then(res=>{
        console.log('res');
        res.json().then(data=>{
            if (res.status === 200) {
                window.location.href = '/';
            } else {
                popupMessage.textContent = data.message;
                popupMessage.classList.add('show');
            }
           
        })
    }).catch(err=>{
        console.log('err');
        console.log(err.data);
    })
}




