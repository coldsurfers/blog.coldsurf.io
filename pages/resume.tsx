import Head from "next/head";
import styles from './post.module.css'

export default function ResumePage() {
    return (
        <>
            <Head>
                <title>blog | resume</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <article className={styles.container}>
                <h1 className={styles.name}>
                    Resume
                </h1>
                <section>
                    <h2>Summary</h2>
                    <div>
                        <p>Hello! My name is DongHo Choi</p>
                        <p>Frontend Developer since Nov. 2018</p>
                    </div>
                    <ul>
                        <li>Email: yungblud@kakao.com</li>
                        <li>Github: <span><a href="https://github.com/yungblud">https://github.com/yungblud</a></span></li>
                        <li>Current Job: Frontend Developer <span><a href="https://laftel.net">@Laftel</a></span></li>
                        <li>Side Job: Musician | Composer</li>
                    </ul>
                </section>
            </article>
        </>
    )
}