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
        .then(function(response) {
            return response = response.json();
        })
        .then(function(response) {
            return response;
        });

    return responseObj;
};

global.FetchTextWithHeaders = async function(verb, url, data){
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
        .then(function(response) {
            return response = response.text();
        })
        .then(function(response) {
            return response;
        });

    return responseObj;
};