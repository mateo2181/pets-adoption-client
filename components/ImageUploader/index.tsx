import React, { useEffect, useMemo, useState } from 'react';
import styles from './ImageUploader.module.scss';

interface Props {
    petId: number;
    sizeInput: number;
    onChange: any;
}

export default function ImageUploader({ petId, sizeInput, onChange }: Props) {
    
    return (
        <>
            <input className={styles.input} type="file" id="file" required accept="image/png, image/jpeg" onChange={onChange} />
            <label className={styles.label} style={{width: sizeInput, height: sizeInput}} htmlFor="file">Choose a file</label>
        </>
  );
}