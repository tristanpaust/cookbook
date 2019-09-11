global.FetchWithHeaders = async function(verb, url, data){
    const request = {
            method: verb,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        };

    if (data)    {
        request.body = JSON.stringify(data);
    }

    const responseObj = await fetch(('/'+url), request)
        .then(function(response){ console.log(response);
            return response = response.json();
        })
        .then(function(response) { console.log('aa', response)
            return response;
        });

    return responseObj;
};