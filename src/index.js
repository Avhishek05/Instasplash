import React from 'react';
import {Image, ScrollView, StyleSheet, Text, TextInput, View, Picker} from 'react-native';
import {get} from './service';
import {Card, Icon} from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            loading: true,
            city: 'Jaipur',
            quality: 'small'
        };
    }


    componentDidMount() {
        this.fetch('Jaipur');
    }

    shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    fetch = (city) => {
        get(city)
            .then(json => {
                json.results = this.shuffleArray(json.results);
                console.log("r", json.results.length);
                this.setState({data: json, loading: false});
            }).catch(e => {
            this.setState({data: [], loading: false});
            console.log(e);
        });
    };

    download = (url, picTitle) => {
        const {fs} = RNFetchBlob
        let PictureDir = fs.dirs.PictureDir // this is the pictures directory. You can check the available directories in the wiki.
        RNFetchBlob
            .config({
                addAndroidDownloads: {
                    notification: true,
                    useDownloadManager: true, // <-- this is the only thing required
                    // Optional, override notification setting (default to true)
                    // Optional, but recommended since android DownloadManager will fail when
                    // the url does not contains a file extension, by default the mime type will be text/plain
                    mime: 'text/plain',
                    description: 'File downloaded by download manager.',
                    path: PictureDir + "/picTitle.jpg", // this is the path where your downloaded file will live in

                }
            })
            .fetch('GET', url)
            .then((resp) => {
                // the path of downloaded file
                resp.path()
            })
    }

    onChangeText = (itemValue) => {
        this.setState({city: itemValue, loading: true});
        this.fetch(itemValue);
    };

    setSelectedValue = (v) => {
        this.setState({quality: v});
    }

    render() {
        const {results} = this.state.data;
        return (
            <ScrollView>
                <View style={{padding: 5}}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={text => this.onChangeText(text)}
                        value={this.state.city}
                    />
                </View>
                <View style={{padding: 5}}>
                    <View style={{flexDirection: 'row', borderColor: 'gray',
                        borderWidth: 1,
                        borderRadius: 5}}>
                        <Text style={{padding: 9, fontSize:16}}>Quality</Text>
                        <Picker
                            selectedValue={this.state.quality}
                            style={{height: 40, width: 150}}
                            onValueChange={(itemValue) => this.setSelectedValue(itemValue)}
                        >
                            <Picker.Item label="Small" value="small"/>
                            <Picker.Item label="raw" value="regular"/>
                            <Picker.Item label="HD" value="raw"/>
                            <Picker.Item label="Full" value="full"/>
                        </Picker>
                    </View>

                </View>
                {
                    this.state.loading ?
                        <View style={styles.container}>
                            <Text>Loading</Text>
                        </View> : <View style={styles.container}>
                            {
                                results.length === 0 ? <Text>No Results found</Text> :
                                    this.renderImages(results)
                            }

                        </View>
                }
            </ScrollView>
        );
    }

    renderImages = (results) => {
        return results.map((image, index) => {
            return (
                <Card style={styles.post} key={index}>
                    <View style={styles.userHeader}>
                        {image.user.profile_image ?
                            <Image
                                style={styles.profilePic}
                                source={{uri: image.user.profile_image.small}}
                            />
                            :
                            <Icon style={{fontSize: 14, paddingRight: 5, paddingLeft: 5, paddingTop: 3}}
                                  type="FontAwesome"
                                  name="user-o"/>
                        }

                        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{image.user.name}</Text>
                    </View>
                    <Image
                        style={styles.main}
                        source={{uri: image.urls[this.state.quality]}}
                    />
                    <View style={styles.name}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <Icon style={{fontSize: 14, paddingRight: 5, paddingTop: 3, color: 'red'}}
                                      type="AntDesign" name="heart"/>
                                <Text>{image.likes} likes</Text>
                            </View>
                            <Icon style={{fontSize: 20, paddingRight: 5, paddingTop: 3}}
                                  onPress={() => this.download(image.links.download, user.username)}
                                  type="Feather" name="download"/>

                        </View>
                        <Text>{image.description}</Text>
                        <Text style={styles.date}>{new Date(image.user.updated_at).toDateString()}</Text>
                    </View>
                </Card>
            );
        });
    };
}


const styles = StyleSheet.create({
    date: {
        color: 'grey',
    },
    post: {
        padding: 10,
        borderRadius: 10,
    },
    name: {
        padding: 5,
    },
    main: {
        height: 450,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    profilePic: {
        height: 25,
        width: 25,
        borderRadius: 20,
        marginRight: 10,
    },
    userHeader: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
    },
    textInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5
    }
});
