import React, { useEffect, useState } from "react";
import styles from "./Detail.module.css";
import "./ProductDetail.css";
import productService from "../../../services/product.service";
import ImageMagnifiers from "./../Image/ImageMagnifiers";
import ProductRate from "./ProductRate";
import { formatVND } from "../../../controller/constants";
import cartService from "../../../services/cartService";
import { useHistory } from "react-router-dom";
import ReactPaginate from "react-paginate";
import Landing from "../../common/Landing/Landing";

export default function Detail(props) {
  /**
   * Create data
   */
  const [product, setProduct] = useState({});
  const [number, setNumber] = useState(1);
  const [RatingList, setRatingList] = useState([]);

  /**
   * Function
   */

  useEffect(() => {
    fetchProduct();
    fetchProductComment(1);setData1(getProductList(6));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  function fetchProduct() {
    productService
      .getDetail(props.match.params.id)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function fetchProductComment(page) {
    productService
      .getComment(props.match.params.id, page)
      .then((res) => {
        setRatingList(res.data);
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  const handlePageClick = (event) => {
    fetchProductComment(event.selected + 1);
  };
  function incrementValue(e) {
     setNumber(number + 1);
  }

  function decrementValue(e) {
    if (number > 1) setNumber(number - 1);
  }

  function onBuyNowClick() {
    alert("buy now");
  }
  /**
   * View
   */
  let history = useHistory();
  function onClickAddCart() {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      cartService
        .addCart(product.id, user.id, number)
        .then((res) => {
          history.push("/cart");
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      console.log(props.data);
      var item = {
        id: product.id,
        name: product.name,
        displayImageName: "01.jpg",
        quantity: number,
        price: product.price,
      };
      cartService.addItemToLocalCart(item);
    }
  }



  const [data1, setData1] = useState([]);

  function getProductList(quantity) {
    productService
      .getList(quantity)
      .then((res) => {
        setData1(res.data);
        // console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  return (
    <div className={`container ${styles.container}`}>
      <h3 className={"product-name"}>{product.name}</h3>
      <div className={`row`}>
        <div
          className={`col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 product-img`}
        >
          <ImageMagnifiers linkImage={props.match.params.id} />
        </div>
        <div className={`col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6`}>
          <div className={"product-infor"}>
            <div style={{ borderBlockEnd: "1px solid #e9a3a3" }}>
              <div className="total-rate">
                Đánh Giá : <span className={" red"}>{product.rating}/5</span>
              </div>
              <p className={"brand"}>
                Thương hiệu: <span className={"name red"}>{product.brand}</span>
              </p>
              <p className={"brand"}>
                Tình trạng: <span className={"name green"}>Còn Hàng</span>
              </p>
            </div>
            <div
              style={{ paddingTop: "15px", borderBlockEnd: "1px solid #e9a3a3" }}
            >
              <h3 className={"price"}>{formatVND(product.price)}đ</h3>
            </div>
            <div
               style={{ marginTop: "15px"}}
            >
            <p className={"description"}>Mô tả: {product.description}</p>
            </div>
            <div className="row"  >
              <h5 className="pb-3">
                Số lượng: hiện còn {product.quantity} sản phẩm
              </h5>
              <div className="col col-md-4 col-12">
                <div className="input-group">
                  <input
                    type="button"
                    value="-"
                    className="button-minus"
                    onClick={decrementValue}
                  />
                  <input
                    type="number"
                    step="1"
                    max=""
                    value={number}
                    className="quantity-field"
                    readOnly={true}
                  />
                  <input
                    type="button"
                    value="+"
                    className="button-plus"
                    onClick={incrementValue}
                  />
                </div>
              </div>
              <div className="col col-md-8 col-12 pt-2">
                <div className="buying-button">
                  <button
                    className="buyNow"
                    onClick={onBuyNowClick}
                    disabled={product.quantity < 1}
                  >
                    Mua ngay
                  </button>
                  <button className="addCart" onClick={onClickAddCart}>
                    thêm giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
<div><Landing data={data1} col={6} /></div>
      <div className="product-rate">
        <div className="rate">
          <h4>Đánh giá của khách hàng</h4>
        </div>
        {RatingList.data ? (
          <div>
            <div className="comment">
              <ProductRate ratingList={RatingList.data} />
            </div>
            <nav
              aria-label="Page navigation example"
              className={styles.navigation}
            >
              <ReactPaginate
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={RatingList.totalPage}
                previousLabel="< previous"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
              />
            </nav>
          </div>
        ) : (
          <div className={styles.container}>
            Không có đánh giá nào để hiển thị
          </div>
        )}
      </div>
    </div>
  );
}
