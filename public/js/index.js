import * as utils from './rex.js';

window.onload = () => {
	getSubscribeToNewsletterBtn().onclick = subscribeToNewsletter;
	getSubscribeToNewsletterEmailInput().addEventListener("keyup", (event) => {
		event.preventDefault();
		if(event.keyCode === 13){
			subscribeToNewsletter();
		}
	});
	getSubscribeToNewsletterModalOkBtn().onclick = hideModal;
}

function subscribeToNewsletter(){
	let email = getSubscribeToNewsletterEmailInput().value.toLowerCase().trim();
	if(email){
		if(utils.isEmailValid(email)){
			subscribe(email);
		}else{
			showError("Email format not supported");
		}
	}else{
		showError("Please enter your email address");
	}
}

function subscribe(email){
	let data = { email: email };
	let url = utils.getHostUrl() + "subscribeToNewsletter";

	showProgressModal();

	utils.sendPostRequest(url, data)
	.then(json => {
		if(json.status == "success"){
			showSubscribeToNewsletterModal();
			window.onclick = hideModal;
			getSubscribeToNewsletterEmailInput().value = '';
		}else{
			hideModal();
			showError(json.error, 5000);
		}
	}).catch(err => {
		console.error(err);
	});
}

function showError(error, duration = 3000){
	let errorMessage = getSubscribeToNewsletterEmailErrorMessage();
	errorMessage.textContent = error;
    errorMessage.style.display = "block";
    utils.wait(duration, () => {
        errorMessage.style.display = "none";
    });
}

function hideModal(){
	getModalBackground().style.display = "none";
	window.onclick = () => {};
}

function showProgressModal(){
	getModalBackground().style.display = "flex";
	getProgressContainerModal().style.display = "block";
	getSubscribeToNewsletterModal().style.display = "none";
}

function showSubscribeToNewsletterModal(){
	getModalBackground().style.display = "flex";
	getProgressContainerModal().style.display = "none";
	getSubscribeToNewsletterModal().style.display = "block";
}


function getModalBackground(){
	return document.getElementById("modalBackground");
}

function getProgressContainerModal(){
	return document.getElementById("progressContainerModal");
}

function getSubscribeToNewsletterModal(){
	return document.getElementById("subscribeToNewsletterModal");
}

function getSubscribeToNewsletterModalOkBtn(){
	return document.getElementById("subscribeToNewsletterModalOkBtn");
}

function getSubscribeToNewsletterEmailInput(){
	return document.getElementById("subscribeToNewsletterEmailInput");
}

function getSubscribeToNewsletterEmailErrorMessage(){
	return document.getElementById("subscribeToNewsletterErrorMsg");
}

function getSubscribeToNewsletterBtn(){
	return document.getElementById("subscribeToNewsletterBtn");
}