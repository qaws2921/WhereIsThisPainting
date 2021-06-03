import React from "react";
import {
  Animated,
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from "react-native";
import {connect} from 'react-redux';
// import {connect} from 'redux';
import {
  ParallaxSwiper,
  ParallaxSwiperPage,
  
} from "react-native-parallax-swiper";
import PaintingInfo from './components/PaintingInfo'
import PaintingImage from './components/PaintingImage'
import API from './lib/api';
import { toggle_loading } from "./actions/creators";

const { width, height } = Dimensions.get("window");

const paintingIds = [436535, 436528, 436532];

class App extends React.Component {
  myCustomAnimatedValue = new Animated.Value(0);

  constructor(props) {
    super(props);
    this.state = {
      info: [],
      // isLoading: true,
    };
    
  }

  componentDidMount() {
    Promise.all(
      paintingIds.map(id => {
        API.get(`/objects/${id}`, {
          params: {
            results: 1,
            inc:
              'primaryImage,title,artistDisplayName,objectEndDate,repository',
          },
        })
          .then(result => result.data)
          .then(result => {
            this.setState({info: [...this.state.info, result]});
          });
      }),
    ).then(() => {
      setTimeout(() => {
        // this.setState({...this.state, isLoading: !this.state.isLoading});
        this.props.toggle_loading();
      }, 3000);
    });
  }

  

  getPageTransformStyle = index => ({
    transform: [
      {
        scale: this.myCustomAnimatedValue.interpolate({
          inputRange: [
            (index - 1) * (width + 8), // Add 8 for dividerWidth
            index * (width + 10),
            (index + 1) * (width + 8)
          ],
          outputRange: [0, 1, 0],
          extrapolate: "clamp"
        })
      },
      {
        rotate: this.myCustomAnimatedValue.interpolate({
          inputRange: [
            (index - 1) * (width + 8),
            index * (width + 8),
            (index + 1) * (width + 8)
          ],
          outputRange: ["180deg", "0deg", "-180deg"],
          extrapolate: "clamp"
        })
      }
    ]
  });

  render() {
    return this.props.isLoading ? (
      <View style={[styles.spinnerContainer, styles.horizontal]}>
        <ActivityIndicator size="large" color="#00ffff" />
      </View>
    ) : (
     <ParallaxSwiper
        speed={0.5}
        animatedValue={this.myCustomAnimationValue}
        dividerWidth={8}
        dividerColor="black"
        backgroundColor="black"
        onMomentumScrollEnd={activePageIndex => console.log(activePageIndex)}
        // showProgressBar={true}
        progressBarBackgroundColor="rgba(0,0,0,0.25)"
        progressBarValueBackgroundColor="white">
        {this.state.info.map((element, index) => (
          <ParallaxSwiperPage
            BackgroundComponent={
              <PaintingImage
                id={element.ojbectId}
                width={width}
                height={height}
                imageURL={element.primaryImage}
              />
            }
            ForegroundComponent={
              <View style={styles.foregroundTextContainer}>
                <PaintingInfo
                  id={element.objectId}
                  title={element.title}
                  artist={element.artistDisplayName}
                  year={element.objectEndDate}
                  location={element.repository}
                />
              </View>
            }
            key={index}
          />
        ))}
      </ParallaxSwiper>
    )
  }

}
const styles = StyleSheet.create({
  backgroundImage: {
    width,
    height
  },
  foregroundTextContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  foregroundText: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: 0.41,
    color: "white"
  },
  spinnerContainer:{
    flex: 1,
    backgroundColor: 'black'
  },
  horizontal: {
    justifyContent: 'center'
  }
});

const mapStateToProps = state => ({isLoading: state.isLoading});

const mapDispatchToProps = dispatch => ({
  toggle_loading: () => dispatch(toggle_loading()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);