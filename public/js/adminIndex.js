const addCatbtn=document.querySelector('#btn');
const deleteBtn=document.querySelector('#delete')

const catName = document.querySelector('#name');
const imageName = document.querySelector('#image');

const product_name=document.querySelector('#product_name');
const description=document.querySelector('#description')
const price=document.querySelector('#price') 
const quantity=document.querySelector('#quantity') 
const prodctId=document.querySelector('#id') 

deleteBtn.onclick=()=>{
    console.log('onclick');
    fetch('http://localhost:3000/admin/category/delete',{
        method:'DELETE',
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify({
            
        })
    })
}

function deleteCategory(id){
    console.log(id);
    if (confirm('Are you sure you want to delete this category?')) {

    fetch(`http://localhost:3000/admin/category/delete?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(responce=>responce.json()).then(data=>{
        console.log(data.message);
        alert(data.message);  
        location.reload();  
      }).catch(err=>{
        alert('Error deleting category');
      })
    
}
}

function delete_subcategory(subCatId,parentCatId){
    if(confirm('Are you sure you want to delete this Sub-category?')){

        fetch(`http://localhost:3000/admin/category/delete_subcategory?id=${subCatId}&Pid=${parentCatId}`,{
            method:'DELETE',
            headers:{
                'Content_Type':'application/json'
            }
        }).then(response=>response.json()).then(data=>{
            alert(data.message);
            location.reload(); 
        }).catch(err=>{
            alert('Error deleting sub_category');
        })
    }
}

function delete_Product(id){
    if(confirm('Are you sure you want to delete this Product?')){
        fetch(`http://localhost:3000/admin/products/delete?id=${id}`,{
            method:'DELETE',
            headers:{
                'Content_Type':'application/json'
            }
        }).then(response=>response.json()).then(data=>{
            alert(data.message);
            location.reload(); 
        }).catch(err=>{
            console.log(err);
            alert(err);
        })
    }
   
}

function update_product(){

    fetch('http://localhost:3000/admin/product/edit',{
        method:'PUT',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            name:product_name.value,
            description:description.value,
            price:price.value,
            quantity:quantity.value,
            id:prodctId.value
            
        })
    }).then(response=>response.json()).then(data=>{
        alert(data.message)
        window.location.href = '/admin/product_list';
    }).catch(err=>{
        alert('somthing went wrong')
    })
    
}














// function create_category(){
//     console.log(catName.value);
//     console.log(imageName.file);
    

//     const formData = new FormData();
//     formData.append('name', catName);
//     formData.append('image', imageName);

//     fetch('http://localhost:3000/admin/category/add_category',{
//         method:'POST',
//         body:formData
//     }).then(responce=>responce.json()).then(data=>{
//         console.log(data);
//     })
// }
