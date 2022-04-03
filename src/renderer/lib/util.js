export const genSequence = function* (){
    let sequence = 1;
    while(true){
        yield sequence++;
    }
}