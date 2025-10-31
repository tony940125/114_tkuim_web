document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");
  const successMessage = document.getElementById("successMessage");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirmPassword");
  const interestsContainer = document.getElementById("interestsContainer");
  const interestsError = document.getElementById("interestsError");
  const termsCheckbox = document.getElementById("terms");

  const strengthIndicator = document.getElementById("strengthIndicator");
  const strengthText = document.getElementById("strengthText");

  // ---------- localStorage ----------
  const saveToStorage = () => {
    const data = {
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      password: passwordInput.value,
      confirmPassword: confirmInput.value,
      interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value),
      terms: termsCheckbox.checked
    };
    localStorage.setItem("signupData", JSON.stringify(data));
  };

  const loadFromStorage = () => {
    const data = JSON.parse(localStorage.getItem("signupData") || "{}");
    if(data.name) nameInput.value = data.name;
    if(data.email) emailInput.value = data.email;
    if(data.phone) phoneInput.value = data.phone;
    if(data.password) passwordInput.value = data.password;
    if(data.confirmPassword) confirmInput.value = data.confirmPassword;
    if(data.interests){
      document.querySelectorAll('input[name="interests"]').forEach(cb => { cb.checked = data.interests.includes(cb.value); });
    }
    if(data.terms) termsCheckbox.checked = data.terms;
    updateStrength();
    updateInterestStyles();
  };
  loadFromStorage();

  // ---------- 密碼強度 ----------
  const updateStrength = () => {
    const val = passwordInput.value;
    let strength = 0;
    if(val.length >= 8) strength++;
    if(/[a-z]/.test(val) && /[A-Z]/.test(val)) strength++;
    if(/\d/.test(val)) strength++;
    if(/[!@#$%^&*]/.test(val)) strength++;

    const width = (strength/4)*100;
    strengthIndicator.style.width = width + "%";

    if(strength <= 1){ 
      strengthIndicator.style.background="red"; 
      strengthText.textContent="弱"; 
    } else if(strength <=3){ 
      strengthIndicator.style.background="orange"; 
      strengthText.textContent="中"; 
    } else { 
      strengthIndicator.style.background="green"; 
      strengthText.textContent="強"; 
    }
  };
  passwordInput.addEventListener("input", () => { updateStrength(); saveToStorage(); });

  // ---------- 興趣標籤事件委派 ----------
  const updateInterestStyles = () => {
    document.querySelectorAll('#interestsContainer label').forEach(label=>{
      const cb = label.querySelector('input');
      if(cb.checked) label.classList.add('checked');
      else label.classList.remove('checked');
    });
  };
  interestsContainer.addEventListener("change", e=>{
    if(e.target.name==="interests"){
      validators.interests();
      updateInterestStyles();
      saveToStorage();
    }
  });

  // ---------- 欄位驗證 ----------
  const validators = {
    name: ()=>{ 
      if(!nameInput.value.trim()){ 
        nameInput.setCustomValidity("姓名不可為空"); document.getElementById("nameError").textContent="姓名不可為空"; return false;
      } 
      nameInput.setCustomValidity(""); document.getElementById("nameError").textContent=""; return true;
    },
    email: ()=>{
      if(!emailInput.value.trim()){ emailInput.setCustomValidity("Email不可為空"); document.getElementById("emailError").textContent="Email不可為空"; return false; }
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!regex.test(emailInput.value)){ emailInput.setCustomValidity("Email格式錯誤"); document.getElementById("emailError").textContent="Email格式錯誤"; return false; }
      emailInput.setCustomValidity(""); document.getElementById("emailError").textContent=""; return true;
    },
    phone: ()=>{
      if(!phoneInput.value.trim()){ phoneInput.setCustomValidity("手機不可為空"); document.getElementById("phoneError").textContent="手機不可為空"; return false; }
      if(!/^\d{10}$/.test(phoneInput.value)){ phoneInput.setCustomValidity("手機需10碼數字"); document.getElementById("phoneError").textContent="手機需10碼數字"; return false; }
      phoneInput.setCustomValidity(""); document.getElementById("phoneError").textContent=""; return true;
    },
    password: ()=>{
      if(passwordInput.value.length < 8){ passwordInput.setCustomValidity("密碼至少8碼"); document.getElementById("passwordError").textContent="密碼至少8碼"; return false; }
      if(!(/[a-zA-Z]/.test(passwordInput.value) && /\d/.test(passwordInput.value))){ passwordInput.setCustomValidity("密碼需英數混合"); document.getElementById("passwordError").textContent="密碼需英數混合"; return false; }
      passwordInput.setCustomValidity(""); document.getElementById("passwordError").textContent=""; return true;
    },
    confirm: ()=>{
      if(confirmInput.value !== passwordInput.value){ confirmInput.setCustomValidity("密碼不一致"); document.getElementById("confirmError").textContent="密碼不一致"; return false; }
      confirmInput.setCustomValidity(""); document.getElementById("confirmError").textContent=""; return true;
    },
    interests: ()=>{
      const checked = document.querySelectorAll('input[name="interests"]:checked').length;
      if(checked<1){ interestsError.textContent="請至少選一個興趣"; return false; }
      interestsError.textContent=""; return true;
    },
    terms: ()=>{
      if(!termsCheckbox.checked){ document.getElementById("termsError").textContent="需同意服務條款"; return false; }
      document.getElementById("termsError").textContent=""; return true;
    }
  };

  [nameInput,emailInput,phoneInput,passwordInput,confirmInput].forEach(input=>{
    input.addEventListener("blur", ()=>validators[input.id.replace("Input","")]());
    input.addEventListener("input", ()=>validators[input.id.replace("Input","")]());
  });

  // ---------- submit ----------
  form.addEventListener("submit", e=>{
    e.preventDefault();
    let firstError = null;
    Object.values(validators).forEach(fn=>{
      if(!fn() && !firstError) firstError = fn;
    });
    if(!validators.interests()) firstError = firstError || (()=>{});
    if(!validators.terms()) firstError = firstError || (()=>{});

    if(firstError){
      const focusInput = [nameInput,emailInput,phoneInput,passwordInput,confirmInput].find(i=>i.validationMessage!=="");
      if(focusInput) focusInput.focus();
      return;
    }

    submitBtn.disabled = true; submitBtn.textContent="Loading...";
    setTimeout(()=>{
      submitBtn.disabled = false; submitBtn.textContent="註冊";
      successMessage.textContent="註冊成功！";
      localStorage.removeItem("signupData");
    },1000);
  });

  // ---------- reset ----------
  resetBtn.addEventListener("click",()=>{
    successMessage.textContent="";
    document.querySelectorAll(".error-message").forEach(p=>p.textContent="");
    strengthIndicator.style.width="0%"; strengthIndicator.style.background="#ddd"; strengthText.textContent="";
    localStorage.removeItem("signupData");
    updateInterestStyles();
  });
});