const stripe = Stripe(
  "pk_test_51LdI6nIeAw8rKaTJK0uRcteZuxM6JAv67KLPcoavvcGo9BjzhP36cvsmRDfkaok350Y8J1OBhOGPwPtTpEm2fFYG00yW3vSzTU"
);
const addToCart = document.querySelectorAll(".add-to-cart");
const cartNumber = document.getElementById("numberCart");
const removeFromCart = document.querySelectorAll(".removeFromCart");
const checkout = document.getElementById("checkout");

function addCart(shoes) {
  axios({
    url: "/cart/add-to-cart",
    method: "post",
    data: shoes,
  }).then((res) => {
    cartNumber.innerText = res.data.totalQty;
    new Noty({
      type: "success",
      timeout: 1000,
      text: "Đã thêm vào giỏ hàng",
      progressBar: false,
    }).show();
  });
}

function removeCart(item) {
  axios({
    url: "/cart/remove-cart",
    method: "post",
    data: item,
  }).then((res) => {
    res.data.totalQty;
    if (res.data.status === "done") {
      location.reload(true);
    }
  });
}

addToCart.forEach((add) => {
  add.addEventListener("click", (e) => {
    e.preventDefault();
    let shoes = JSON.parse(add.dataset.shoes);
    addCart(shoes);
  });
});

removeFromCart.forEach((rm) => {
  rm.addEventListener("click", (e) => {
    let item = JSON.parse(rm.dataset.remove);
    removeCart(item);
  });
});

$(document).ready(function () {
  // Prepare the preview for profile picture
  $("#image").change(function () {
    readURL(this);
  });
});
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#avatar-img").attr("src", e.target.result).fadeIn("slow");
    };
    reader.readAsDataURL(input.files[0]);
  }
}

async function payment() {
  try {
    const res = await axios({
      url: "/cart/checkout-session",
      method: "post",
    });
    await stripe.redirectToCheckout({
      sessionId: res.data.session.id,
    });
  } catch (error) {
    console.log(error);
  }
}

if (checkout) {
  checkout.addEventListener("click", (el) => {
    el.preventDefault();
    payment();
  });
}
