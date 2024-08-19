
const Main = () => {
  return (
    <main className="h-[50dvh] sm:h-[60dvh]">
      <div className="flex h-full flex-col justify-evenly bg-white/20 bg-gradient bg-contain bg-left bg-no-repeat bg-blend-overlay sm:flex-row sm:p-3">
        <div className="flex items-center justify-center text-center sm:h-full sm:flex-1 sm:justify-start sm:text-start">
          <div className="">
            <h1 className="text-xl font-semibold md:text-3xl">Welcome to Staking App</h1>
            <p className="text-sm md:text-lg">Stake your BTC and contribute to the network collateral.</p>
          </div>
        </div>
        <div className="flex items-center justify-center text-center sm:h-full sm:flex-1 sm:justify-start sm:text-start">
          <div className="">
            <h2 className="text-xl font-semibold md:text-3xl">Stake your WBTC token and earn Rewards</h2>
            <p className="text-sm md:text-lg">You can earn rewards upto 1% APY.</p>
            <p className="text-sm md:text-lg">Your tokens and rewards will be returned once the time ends.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Main