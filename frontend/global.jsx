global.FetchWithHeaders = async function(verb, url, data){
    const request = {
            method: verb,
            headers: {
              'Authorization': localStorage.getItem('token')
            }
        };

    if (data)    {
        request.body = JSON.stringify(data);
    }

    const responseObj = await fetch(url, request)
        .then(function(response){
            return response = response.json();
        })
        .then(function(response) {
            return response;
        });

    return responseObj;
};