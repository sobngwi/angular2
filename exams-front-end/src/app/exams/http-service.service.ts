export class HttpServiceService {
  executeSynchronousRequest( url: string) {
    // console.log('starting execution of sync request');
    var data;
    const request = new XMLHttpRequest();
    request.open('GET',
      url,
      false);  // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
         data = JSON.parse(request.responseText);
      // console.log(data);
    }
    return data;
  }
}
