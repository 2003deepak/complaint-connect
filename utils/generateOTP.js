const generateOTP = () =>{

    let randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `${randomNumber}`;


}


module.exports = generateOTP;