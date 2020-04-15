// https://github.com/Microsoft/ApplicationInsights-JS
// https://docs.microsoft.com/en-us/azure/azure-monitor/app/javascript#snippet-based-setup

const trace = (client, message, environment) => {
    if(environment!="production" && (!client)){
        console.log(message)
    }
    if(client){
        client.trackTrace({message})
        if(environment!="production"){
            console.log(message)
            client.flush()
        }
    }

}
const error = (client, exception, environment) => {
    if(environment!="production" && (!client)){
        console.error(exception)
    }
    if(client){
        client.trackEvent({name: "exception", properties: exception})
        if(environment!="production"){
            console.error(exception)
            client.flush()
        }
    }

}
const event = (client, eventName, environment) => {
    if(environment!="production" && (!client)){
        console.info(eventName)
    }
    if(client){
        client.trackEvent(eventName)
        if(environment!="production"){
            console.info(eventName)
            client.flush()
        }
    }

}

module.exports = {
    trace,
    error,
    event
}

