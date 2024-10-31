import React from 'react';
import logoUCN from '../assets/logoUCN2.png';

const HeaderEncuesta = ({ leftContent, rightContent }) => {
    return (
        <div className="flex flex-col border-gray-700 border-2">
            <div className="flex">
                <div className="flex-1 border-black  border-l-[1px] border-t-[1px] border-b-[1px] flex items-center justify-center flex-col">
                    <img src={logoUCN} className='w-[25%]'/>
                    <h4 className='font-semibold'>DIRECCION GENERAL DE POSTGRADO</h4>
                </div>
                <div className="w-1/4 border-black border-[1px] flex items-center justify-center">
                    <h1 className='font-bold text-2xl'>
                        REGISTRO
                    </h1>
                </div>
            </div>
            <div className="flex">
                <div className="flex-1 bg-gray-200 border-black border-b-[1px] border-l-[1px] flex items-center justify-center">
                    <h1 className='font-semibold text-2xl'>ENCUESTA DE EVALUACION DOCENTE </h1>
                </div>
                <div className="w-1/4 border-black border-l-[1px] border-b-[1px] border-r-[1px] font-bold flex items-center justify-center text-2xl">
                    REG-PG-10
                    <br></br>
                    Rev. 001
                </div>
            </div>
        </div>
    );
};

export default HeaderEncuesta;
