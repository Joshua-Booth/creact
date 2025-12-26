import React from 'react'
import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  className?: string
}

export default function BackButton({ className }: BackButtonProps) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(-1)}
      className={className}
    >
      Back
    </button>
  )
}
