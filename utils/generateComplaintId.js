

const generateComplaintId = () =>{
    let randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `C${randomNumber}`;
}

module.exports = generateComplaintId;