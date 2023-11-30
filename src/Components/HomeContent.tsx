import React from 'react'
import styles from '../styles/home.module.scss'

type Props = {}

function HomeContent({}: Props) {
  return (
    <div className={styles.homeContainer}>
        <div className={styles.img}>
            <img src="/letschatLOGO.jpg" alt="logo" />
        </div>
        <h1 className={styles.homeHeading}>Let&apos;s Chat</h1>
        <h3>A Place where Anyone and Everyone can open up</h3>
        <p>sign up to chat</p>
    </div>
  )
}

export default HomeContent;