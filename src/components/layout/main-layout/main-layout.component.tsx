import * as React from "react";

// @ts-ignore
import styles from "./main-layout.module.scss";
import {
  FooterComponent,
  HeaderComponent,
  NavigatorComponent,
  SocialComponent,
  BackgroundComponent,
  CardComponent,
  MainComponent,
} from "../../../components";

type Props = {
  navigatorChildren?: React.ReactNode;
  headerChildren?: React.ReactNode;
  footerChildren?: React.ReactNode;
} & React.HTMLProps<HTMLDivElement>;

export const MainLayoutComponent: React.FC<Props> = ({
  children,
  navigatorChildren,
  headerChildren,
  footerChildren,
}) => {
  return (
    <BackgroundComponent>
      <CardComponent className={styles.bigCard}>
        <div className={styles.container}>
          <NavigatorComponent children={navigatorChildren} />
          <div className={styles.bigContainer}>
            <HeaderComponent children={headerChildren} />
            <MainComponent children={children} />
          </div>
        </div>
        <FooterComponent>
          <SocialComponent children={footerChildren} />
        </FooterComponent>
      </CardComponent>
    </BackgroundComponent>
  );
};