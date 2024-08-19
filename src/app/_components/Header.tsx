import ConnectButton from '@/components/ConnectButton'

const Header = () => {
  
  return (
    <header>
      <div className='flex items-center justify-between px-4 py-2'>
        <div className="logo">
          <h6>Staking App</h6>
        </div>
        <ConnectButton />
      </div>
    </header>
  )
}

export default Header