var brand = document.location.toString().split("/dotmatrix/")[1].split(".")[0];
brand = "brand-" + brand;

document.body.classList.add(brand);
