(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        } 
    });
    
    
   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:2
            }
        }
    });


    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });



    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });

})(jQuery);



// Mảng giỏ hàng
let cart = [];

// Hàm cập nhật giỏ hàng trên giao diện
function updateCartUI() {
    let cartTableBody = document.querySelector("tbody"); // Chọn tbody của bảng
    cartTableBody.innerHTML = ""; // Xóa nội dung cũ

    let total = 0;

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        let row = document.createElement("tr");
        row.innerHTML = `
            <th scope="row">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" class="img-fluid me-5 rounded-circle" style="width: 80px; height: 80px;">
                </div>
            </th>
            <td><p class="mb-0 mt-4">${item.name}</p></td>
            <td><p class="mb-0 mt-4">$${item.price.toFixed(2)}</p></td>
            <td>
                <div class="input-group quantity mt-4" style="width: 100px;">
                    <div class="input-group-btn">
                        <button class="btn btn-sm btn-minus rounded-circle bg-light border" data-index="${index}">
                            <i class="fa fa-minus"></i>
                        </button>
                    </div>
                    <input type="text" class="form-control form-control-sm text-center border-0" value="${item.quantity}">
                    <div class="input-group-btn">
                        <button class="btn btn-sm btn-plus rounded-circle bg-light border" data-index="${index}">
                            <i class="fa fa-plus"></i>
                        </button>
                    </div>
                </div>
            </td>
            <td><p class="mb-0 mt-4">$${itemTotal.toFixed(2)}</p></td>
            <td>
                <button class="btn btn-md rounded-circle bg-light border mt-4 btn-remove" data-index="${index}">
                    <i class="fa fa-times text-danger"></i>
                </button>
            </td>
        `;
        cartTableBody.appendChild(row);
    });

    // Cập nhật tổng tiền
    document.querySelector(".cart-total").textContent = `$${total.toFixed(2)}`;

    // Thêm sự kiện cho các nút tăng/giảm số lượng
    document.querySelectorAll(".btn-minus").forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1); // Xóa nếu số lượng về 0
            }
            updateCartUI();
        });
    });

    document.querySelectorAll(".btn-plus").forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            cart[index].quantity++;
            updateCartUI();
        });
    });

    // Thêm sự kiện xóa sản phẩm
    document.querySelectorAll(".btn-remove").forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            cart.splice(index, 1);
            updateCartUI();
        });
    });
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(name, price, image) {
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price: parseFloat(price), image, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartUI();
}

document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function (event) {
        event.preventDefault();
        
        let name = this.getAttribute("data-name");
        let price = this.getAttribute("data-price");

        // Tìm phần tử cha .fruite-item
        let productElement = this.closest(".fruite-item");
        if (!productElement) {
            console.error("Không tìm thấy phần tử sản phẩm!", this);
            return;
        }

        // Tìm hình ảnh bên trong .fruite-img
        let imageElement = productElement.querySelector(".fruite-img img");
        if (!imageElement) {
            console.error("Không tìm thấy ảnh sản phẩm!", this);
            return;
        }
        let image = imageElement.src;

        addToCart(name, price, image);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let storedCart = localStorage.getItem("cart");
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartUI();
    }
});




