import * as utils from './rex.js';

var subscriberEmail = '';

window.onload = () => {
	getUnsubscribeFromNewsletterBtn().onclick = unsubscribeFromNewsletter;
	getUnsubscribeFromNewsletterModalOkBtn().onclick = hideModal;

	let subscriberId = getSubscriberIdFromUrl();
	if(subscriberId != null){
		getSubscriberEmail(subscriberId);
	}else{
		redirectToIndexHMTL();
	}	
}

function redirectToIndexHMTL(){
	window.open('index.html', '_self');
}

function getSubscriberIdFromUrl(){
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get("id");
}

function getSubscriberEmail(subscriberId){

	showProgressModal();

	let url = utils.getHostUrl() + "getNewsletterSubscriber?id=" + subscriberId;

	utils.sendGetRequest(url)
	.then(json => {
		if(json.status == "success"){
			subscriberEmail = json.subscriber.email;
			getSubscriberEmailContent().textContent = json.subscriber.email;
			hideModal();
		}else{
			getUnsubscribeFromNewsletterMessage().textContent = json.error;
			showUnsubscribeFromNewsletterModal();
			getUnsubscribeFromNewsletterModalOkBtn().onclick = redirectToIndexHMTL;
			window.onclick = redirectToIndexHMTL;
		}
	}).catch(err => {
		console.error(err);
	});
}

function unsubscribeFromNewsletter(){
	if(subscriberEmail){
		if(utils.isEmailValid(subscriberEmail)){
			unsubscribe(subscriberEmail);
		}else{
			hideModal();
		}
	}else{
		hideModal();
	}
}

function unsubscribe(email){
	let data = { email: email };
	let url = utils.getHostUrl() + "unsubscribeFromNewsletter";

	showProgressModal();

	utils.sendPostRequest(url, data)
	.then(json => {
		if(json.status == "success"){
			getUnsubscribeFromNewsletterMessage().textContent = json.message;
		}else{
			getUnsubscribeFromNewsletterMessage().textContent = json.error;
		}

		showUnsubscribeFromNewsletterModal();
		getUnsubscribeFromNewsletterModalOkBtn().onclick = redirectToIndexHMTL;
		window.onclick = redirectToIndexHMTL;
	}).catch(err => {
		console.error(err);
		getUnsubscribeFromNewsletterMessage().textContent = err;
		showUnsubscribeFromNewsletterModal();
		window.onclick = hideModal;
	});
}

function hideModal(){
	getModalBackground().style.display = "none";
	window.onclick = () => {};
}

function showProgressModal(){
	getModalBackground().style.display = "flex";
	getProgressContainerModal().style.display = "block";
	getUnsubscribeFromNewsletterModal().style.display = "none";
}

function showUnsubscribeFromNewsletterModal(){
	getModalBackground().style.display = "flex";
	getProgressContainerModal().style.display = "none";
	getUnsubscribeFromNewsletterModal().style.display = "block";
}


function getModalBackground(){
	return document.getElementById("modalBackground");
}

function getProgressContainerModal(){
	return document.getElementById("progressContainerModal");
}

function getUnsubscribeFromNewsletterModal(){
	return document.getElementById("unsubscribeFromNewsletterModal");
}

function getUnsubscribeFromNewsletterMessage(){
	return document.getElementById("unsubscribeFromNewsletterMessage");
}

function getUnsubscribeFromNewsletterModalOkBtn(){
	return document.getElementById("unsubscribeFromNewsletterModalOkBtn");
}

function getSubscriberEmailContent(){
	return document.getElementById("subscriberEmailContent");
}

function getUnsubscribeFromNewsletterBtn(){
	return document.getElementById("unsubscribeFromNewsletterBtn");
}