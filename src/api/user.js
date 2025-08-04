const getUser = async (userName_Id) => {
    console.log("userNameId", userName_Id)
    const response = await fetch(`http://localhost:3000/v1/user/${userName_Id}`, {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        console.log("Fetching user failed");
        alert("Some internal Error occurred");
        return null;
    }

    const data = await response.json(); // <- FIXED: no `.data` before `.json()`

    console.log("getUser data returned", data?.data)

    return data.data;
};

export { getUser };
