import axios from 'axios';
import "dotenv/config";

const apiKey = process.env.CN_APIKEY;
const secret = process.env.CN_SECRET;
const trackingUrl = process.env.CN_TRACKING_URL;
const genTokenUrl = process.env.CN_GEN_TOKEN_URL;



async function getToken() {
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-apikey': apiKey
    };

    try {
        const response = await axios.post(genTokenUrl, null, {
            headers: headers,
            auth: {
                username: apiKey,
                password: secret
            }
        });

        if (response.status === 200) {
            const token = response.data.access_token;
            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
        } else {
            console.error(`Failed to fetch data. Status code: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching token:', error.message);
        return null;
    }
}



 async function tracking(ctnrNums) {
    const headers = await getToken();
    // Check if token is fetched
    if (!headers) {
        return { error: "Failed to fetch the token. Please try again later." };
    }
    const modifiedCtnrNums = ctnrNums.map(ctnr => ctnr.slice(0, -1)).join(',');
    
    console.log(modifiedCtnrNums);


    const trackingParam = {
        equipmentIds: modifiedCtnrNums
    }
    try {
    const response = await axios.get(trackingUrl, { headers, params: trackingParam } );
    // console.log(response.data)
    return response.data;
    
    } catch(error) {
        console.error('Error fetching tracking data:', error.message);
        return { error: "Error fetching tracking data. Please try again later." };
    }
}

export default tracking;