// Đối tượng `Validator`
function Validator(options) {
  // hàm thực hiện validate
  var selectorRule = {};
  function validate(inputElement, rule) {
    var errorMessage;
    var errorElement = inputElement.parentElement.querySelector(
      options.errorSelector
    );

    // lấy ra các rules của selector
    var rules = selectorRule[rule.selector];
    // lặp qua từng rule và kiểm tra
    // nếu có lỗi dừng việc kiểm tra
    for (var i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }
    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }
    return !errorMessage;
  }

  //Lấy element của form cần validate
  var formElement = document.querySelector(options.form);
  if (formElement) {
    // khi submit form
    formElement.onsubmit = function (e) {
      e.preventDefault();

      var isFormValid = true;

      // thực hiện lặp qua từng rule và validate
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        // trường hợp submit với javascript
        if (typeof options.onSubmit === "function") {
          var enableInputs = formElement.querySelectorAll("[name]");
          var formValues = Array.from(enableInputs).reduce(function (
            values,
            input
          ) {
            return (values[input.name] = input.value) && values;
          },
          {});
          options.onSubmit(formValues);
        }
        // trường hợp submit với hành vi mặc định
        else {
          formElement.submit();
        }
      }
    };
    // lặp qua mọi rule và xử lý (lắng nghe sự kiện blur, input, ...)
    options.rules.forEach(function (rule) {
      // lưu lại các rule cho mỗi input
      if (Array.isArray(selectorRule[rule.selector])) {
        selectorRule[rule.selector].push(rule.test);
      } else {
        selectorRule[rule.selector] = [rule.test];
      }

      var inputElement = formElement.querySelector(rule.selector);

      if (inputElement) {
        //Xử lý trường hợp blur khỏi input
        inputElement.onblur = function () {
          // value: inputElement.value
          // test func:rule.test
          validate(inputElement, rule);
        };
        //xử lý mỗi khi người dùng nhập vào input
        inputElement.oninput = function () {
          var errorElement = inputElement.parentElement.querySelector(
            options.errorSelector
          );
          errorElement.innerText = "";
          inputElement.parentElement.classList.remove("invalid");
        };
      }
    });
  }
}

// Định nghĩa rules
// Nguyên tắc của các rules:
// 1. Khi có lỗi => trả ra message lỗi
// 2. Khi hợp lệ => Không trả ra cái gì cả (undefined)
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Vui lòng nhập trường này";
    },
  };
};
Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || "Trường nay phải là email";
    },
  };
};
Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : message || `Vui lòng nhập tối thiểu ${min} ký tự`;
    },
  };
};
Validator.isConfirmed = function (selector, getConFirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConFirmValue()
        ? undefined
        : message || "Giá trị nhập vào không chính xác";
    },
  };
};
