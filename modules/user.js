let users = {
    533322:{
        socketID: "12222223",
        mongodbID: "133333333333",
        lastSeen: "7847328472"
    },
}

export const addUDPuser = async (ip) =>{
    const userID = Math.round(ip.split('.').reduce((a, b) => a + b, 0) * Math.PI) 
    const findUser = await User.find({"mid": userID}).exec();
    if (findUser == [] ){
        // create new user
        const newUser = new User({
            mid:ip
        })

    }else{
        // add user id to users
    }

    // Look socket io user
    console.log(findUser)
    // const newUser = new User({
    //     mid: userID
    // })
    // const createUser = await newUser.save()
    // console.log(createUser)
    
}
export const addIOuser = async (id,ip) => {

    // This is basically everyone going on website
    // User only gets created if you push UDP data
    // Store IO user in array to match if we get udp data
    ioUsers.push({"ioid": id, "ip": ip})

    //Check if we have UDP
    const checkCache = await client.hGetAll(ip);
    console.log(checkCache)
}