'use client'
import Swal from 'sweetalert2'

export function showSuccess(title: string) { Swal.fire({ icon: 'success', title }) }
export function showError(title: string, text?: string) { Swal.fire({ icon: 'error', title, text }) }
