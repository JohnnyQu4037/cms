export const fibonacci =(index)=>{
  if(index === 0){
    return 0
  }
  if (index === 1){
    return 1
  }else{
    return fibonacci(index-1)+fibonacci(index-2)
  }
}