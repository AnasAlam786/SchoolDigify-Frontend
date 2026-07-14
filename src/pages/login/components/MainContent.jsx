import LoginCard from "./mainContent/LoginCard";
// import FeatureCard from "./mainContent/FeatureCard"

function MainContent() {

    return (
        <main className="relative py-12 px-4">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full
                            bg-gradient-to-br from-primary/20 to-accent/20 mb-4 sm:mb-6 animate-float">
                        <i className="fas fa-school text-primary text-2xl sm:text-3xl"></i>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
                        Welcome to{" "}
                        <span
                            className=" bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500
                                bg-clip-text text-transparent " >
                            SchoolDigify
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-4 px-4">
                        The most comprehensive school management platform for modern education
                    </p>

                    <div className="flex flex-wrap justify-center  sm:gap-3 mt-6 sm:mt-8">
                        <span className=" sm:px-4 sm:py-2 bg-accent/10 text-accent rounded-full text-xs sm:text-sm">✓ 24/7 Support</span>
                    </div>
                </div>

                <div className="gap-10 flex justify-center">
                    <LoginCard />
                </div>
            </div>
        </main>
    );
}

export default MainContent;
