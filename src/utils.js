export default function removeDuplicates(arr) {

    // Create an array of objects

    const jsonObject = arr.map(JSON.stringify);
    const uniqueSet = new Set(jsonObject);
    const uniqueArray = Array.from(uniqueSet).map(JSON.parse);

    console.log(uniqueArray);
}

