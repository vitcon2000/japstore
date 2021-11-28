import React, { useEffect, useState } from "react";
import styles from "./Cart.module.css";
import { formatVND } from "../../../controller/constants";
import cartService from "../../../services/cartService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import imageService from "../../../services/imageService";
import { useHistory } from "react-router";
export default function Cart() {
  let user = JSON.parse(localStorage.getItem("user"));
  const minQuantity = 1,
    maxQuantity = 99;
  const [cartitems, setCartitems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const history = useHistory();

  useEffect(() => {
    retrieveCartItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  function onSubQuantity(cartItem) {
    let productId = cartItem.id;
    let quantity = cartItem.quantity;
    quantity = quantity > minQuantity ? quantity - 1 : quantity;
    updateQuantity(productId, quantity);
  }
  function onAddQuantity(cartItem) {
    let productId = cartItem.id;
    let quantity = cartItem.quantity;
    quantity = quantity < maxQuantity ? quantity + 1 : quantity;
    updateQuantity(productId, quantity);
  }
  function retrieveCartItems() {
    cartService
      .getCart(user.id)
      .then((res) => {
        setCartitems(res.data);
        let sum = 0;
        res.data.forEach((e) => {
          sum += e.price * e.quantity;
        });
        setTotalPrice(sum);
        // console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function updateQuantity(productId, quantity) {
    console.log(productId);
    cartService
      .updateCartItem(productId, user.id, quantity)
      .then((res) => {
        // console.log(res.data);
        retrieveCartItems();
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function onClickDeleteCartItem(cartItem) {
    let user = JSON.parse(localStorage.getItem("user"));
    cartService
      .deleteCartItem(cartItem.id, user.id)
      .then((res) => {
        retrieveCartItems();
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function redirectPayment() {
    history.push("/payment");
  }
  function onReturn() {
    history.push("/cart");
  }
  return (
    <div className={styles.container}>
      <div className={`${styles.header}`}>
        <span>Giỏ hàng</span>
      </div>
      {cartitems.length > 0 ? (
        <div className={`${styles.content}`}>
          <p className={`${styles.totalPrice}`}>
            Tổng tiền:{" "}
            <span className={styles.price}>{formatVND(totalPrice)}đ</span>
          </p>
          <button className={`${styles.btnAdd}`} onClick={redirectPayment}>
            Thanh toán
          </button>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>Tên sản phẩm</th>
                <th>Giá bán lẻ</th>
                <th>Số lượng </th>
                <th>Tổng tiền</th>
                <th>Xóa</th>
              </tr>
              {cartitems.map((cartitem, index) => (
                <tr key={index}>
                  <td>
                    <div className={styles.imgContainer}>
                      <img
                        src={imageService.get(cartitem.displayImageName)}
                        alt="Hình ảnh"
                      />
                    </div>
                  </td>
                  <td>{cartitem.name}</td>
                  <td className={styles.price}>{formatVND(cartitem.price)}đ</td>
                  <td>
                    <div className={styles.quantityContainer}>
                      <button
                        className={styles.btnSub}
                        onClick={() => onSubQuantity(cartitem)}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <button className={styles.btnDisplay}>
                        {cartitem.quantity}
                      </button>
                      <button
                        className={styles.btnAdd}
                        onClick={() => onAddQuantity(cartitem)}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </td>
                  <td className={styles.price}>
                    {formatVND(cartitem.quantity * cartitem.price)}đ
                  </td>
                  <td>
                    <button onClick={() => onClickDeleteCartItem(cartitem)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.empty}>
          <p>Giỏ hàng trống</p>
        </div>
      )}
    </div>
  );
}
