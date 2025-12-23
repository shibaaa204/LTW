import { BE_URL } from '../lib/config'

async function fetchModel(url) {
  try{
    const response = await fetch(BE_URL + url, {
      method: "GET",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    if (!response.ok){
      throw new Error("Network not ok")
    }
    
    return response.json()

  } catch(err){
    console.error("Error with fetch", err)
    throw err
  }
}

export default fetchModel