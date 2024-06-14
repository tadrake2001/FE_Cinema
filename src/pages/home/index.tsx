import { Col, Divider, Row, Card, Empty, Spin, Carousel } from 'antd';
import styles from 'styles/client.module.scss';
import SearchClient from '@/components/client/search.client';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IFilm } from '@/types/backend';
import { callFetchFilm } from '@/config/api';

import FilmCard from '@/components/client/card/film.card';
import PromotionCard from "@/components/client/card/promotion.card";
import CinemaCard from "@/components/client/card/cinema.card";

const HomePage = () => {
  return (
    <div className={`${styles["container"]} ${styles["home-section"]}`}>
      <PromotionCard />
      {/* <div style={{ margin: 50 }}></div> */}
      <Divider />
      <CinemaCard />
      <Divider />
      <FilmCard />
    </div>
  );
};

export default HomePage;