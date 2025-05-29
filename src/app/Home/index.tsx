import { useState, useEffect } from 'react'
import { 
  View, 
  Image, 
  TouchableOpacity, 
  Text, 
  FlatList, 
  Alert 
} from 'react-native'

import { styles } from './styles'
import { FilterStatus } from '@/types/FilterStatus'
import { itemsStorage, ItemStorage } from '@/storage/itemStorage'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Filter } from '@/components/Filter'
import { Item } from '@/components/Item'

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE]

export function Home() {
  const [filter, setFilter] = useState<FilterStatus>(FILTER_STATUS[0])
  const [description, setDescription] = useState<string>('')
  const [items, setItems] = useState<ItemStorage[]>([])

  async function handleAddItem() {
    if (!description.trim()) {
      return Alert.alert('Adicionar', 'Informe a descrição para adicionar')
    }

    const newItem = {
      id: Math.random().toString(36).substring(2),
      description,
      status: FilterStatus.PENDING,
    }

    await itemsStorage.add(newItem)
    await itemsByStatus()

    setDescription('')
    setFilter(FilterStatus.PENDING)
  }

  async function itemsByStatus() {
    try {
      const response = await itemsStorage.getByStatus(filter)
      setItems(response)
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível filtrar os itens')
    }
  }

  async function handleRemoveItem(id: string) {
    try {
      await itemsStorage.remove(id)
      await itemsByStatus()
    } catch (error) {
      Alert.alert('Remover', 'Não foi possível remover o item')
    }
  }

  function handleClearItems() {
    Alert.alert('Limpar', 'Deseja remover todos os itens?', [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: () => onClear() }
    ])
  }

  async function onClear() {
    try {
      await itemsStorage.clear()
      setItems([])
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível limpar os itens')
    }
  }

  useEffect(() => {
    itemsByStatus()
  }, [filter])

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/logo.png')} style={styles.logo}/>

      <View style={styles.form}>
        <Input 
          onChangeText={setDescription}
          placeholder="O que você precisa comprar?"
          value={description}
        />
        <Button title='Adicionar' onPress={handleAddItem}/>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          {
            FILTER_STATUS.map((status) => (
              <Filter 
                key={status} 
                status={status} 
                isActive={filter === status}
                onPress={() => setFilter(status)}
              />
            ))
          }

          <TouchableOpacity style={styles.clearButton} onPress={handleClearItems}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList 
          data={items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Item
                data={item}
                onRemove={() => handleRemoveItem(item.id)}
                onStatus={() => console.log('Change item status')}
            />
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>Nenhum item aqui</Text>
          )}
        />
      </View>
    </View>
  )
}