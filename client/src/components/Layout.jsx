import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { motion } from 'framer-motion'

function Layout({ children, hideFooter }) {
    return (
        <>
            <Navbar />
            <motion.div
                className='container'
                style={{ paddingTop: '90px', minHeight: '80vh' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                {children}
            </motion.div>
            {!hideFooter && <Footer />}
        </>
    )
}

export default Layout